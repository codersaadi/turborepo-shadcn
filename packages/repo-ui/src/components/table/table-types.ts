// ---------- Types for DataTable ----------

// Represents an option for dropdowns, select inputs, etc.
export interface Option {
	label: string; // Display text for the option (e.g., "Admin")
	value: string; // The value associated with the option (e.g., "admin")
	icon?: React.ComponentType<{ className?: string }>; // Optional icon component to be displayed with the option
	withCount?: boolean; // Optional flag indicating if a count (e.g., number of items) should be displayed next to the label
}

// Represents a filter field configuration for a DataTable component
export interface DataTableFilterField<TData> {
	label: string; // Display text for the filter field (e.g., "Status")
	value: keyof TData; // The key in the data model that this filter applies to (e.g., "status" in user data)
	placeholder?: string; // Placeholder text for the filter input (e.g., "Select status")
	options?: Option[]; // Optional list of predefined options for the filter (e.g., ["Active", "Inactive"])
}

// Represents a detailed filter option configuration for a DataTable component
export interface DataTableFilterOption<TData> {
	id: string; // Unique identifier for this filter option (e.g., "status-filter")
	label: string; // Display text for the filter option (e.g., "Status Filter")
	value: keyof TData; // The key in the data model that this filter option targets (e.g., "status" in user data)
	options: Option[]; // List of selectable options for this filter (e.g., [{ label: "Active", value: "active" }])
	filterValues?: string[]; // Optional predefined values to be applied for filtering (e.g., ["active", "pending"])
	filterOperator?: string; // Optional filter operator, such as "equals" or "contains" (default can be "equals")
	isMulti?: boolean; // Indicates if multiple selections are allowed (true for multi-select filters)
}
