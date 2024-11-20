import { source } from "@/app/source";
import defaultMdxComponents from "fumadocs-ui/mdx";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export default async function Page({
  params: paramsPromise,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await paramsPromise;
  const page = source.getPage(params.slug);
  if (!page) { notFound(); }

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents }} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({ params: paramsPromise }: { params: Promise<{ slug?: string[] }> }) {
  const params = await paramsPromise;
  const page = source.getPage(params.slug);

  if (!page) { notFound(); }

  return {
    title: page.data.title,
  } satisfies Metadata;
}
