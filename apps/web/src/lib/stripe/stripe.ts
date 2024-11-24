import env from "@repo/env";
import Stripe from "stripe";

export const stripe = new Stripe(env.STRIPE_API_KEY || "", {
	apiVersion: "2024-11-20.acacia",
	typescript: true,
});

// General function for fetching paginated data
async function fetchStripePage<T extends { id: string }>(
	fetchFunction: (
		params: Stripe.PaginationParams,
	) => Promise<Stripe.ApiList<T>>,
	params: Stripe.PaginationParams,
): Promise<{ data: T[]; hasMore: boolean; lastId: string | null }> {
	try {
		const response = await fetchFunction(params);

		return {
			data: response.data,
			hasMore: response.has_more,
			lastId: response.data.length
				? (response.data?.[response.data.length - 1]?.id ?? null)
				: null,
		};
	} catch (error) {
		console.error("Error fetching data from Stripe:", error);
		return { data: [], hasMore: false, lastId: null };
	}
}

// Fetch payments with individual pagination
export const fetchPayments = async (
	limit = 100,
	startingAfter?: string,
	dateFilter?: unknown,
) => {
	const params: Stripe.PaymentIntentListParams = {
		limit,
		starting_after: startingAfter,
		...(dateFilter || {}),
	};
	return fetchStripePage(
		stripe.paymentIntents.list.bind(stripe.paymentIntents),
		params,
	);
};

// Fetch customers with individual pagination
export const fetchCustomers = async (limit = 100, startingAfter?: string) => {
	const params: Stripe.CustomerListParams = {
		limit,
		starting_after: startingAfter,
	};
	return fetchStripePage(stripe.customers.list.bind(stripe.customers), params);
};

// Fetch subscriptions with individual pagination
export const fetchSubscriptions = async (
	limit = 100,
	startingAfter?: string,
	status: Stripe.SubscriptionListParams.Status = "active",
) => {
	const params: Stripe.SubscriptionListParams = {
		limit,
		starting_after: startingAfter,
		status,
	};
	return fetchStripePage(
		stripe.subscriptions.list.bind(stripe.subscriptions),
		params,
	);
};

// Dashboard data fetcher
export const fetchStripeData = async () => {
	try {
		const [payments, customers, subscriptions] = await Promise.all([
			fetchPayments(),
			fetchCustomers(),
			fetchSubscriptions(),
		]);

		return { payments, customers, subscriptions };
	} catch (error) {
		console.error("Error fetching dashboard data:", error);
		return {
			payments: { data: [], hasMore: false, lastId: null },
			customers: { data: [], hasMore: false, lastId: null },
			subscriptions: { data: [], hasMore: false, lastId: null },
		};
	}
};
