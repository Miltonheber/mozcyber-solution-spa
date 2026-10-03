import PostArticle from "@/features/education/components/PostArticle";

export const metadata = { title: "Guia de prevenção" };

export default async function GuiaPage({ params }) {
  const { slug } = await params;
  return <PostArticle slug={slug} />;
}
