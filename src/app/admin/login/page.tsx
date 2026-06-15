import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="mx-auto max-w-md py-10">
      <h1 className="text-2xl font-bold text-brand-deep">Logga in</h1>
      <p className="mt-2 text-muted">Admin för offerter och signering.</p>
      <LoginForm next={next ?? "/admin"} />
    </div>
  );
}
