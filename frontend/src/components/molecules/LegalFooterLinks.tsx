import { useRouter } from "next/navigation";

function LegalFooterLinks() {
  const router = useRouter();

  return (
    <div className="mt-4 flex justify-center gap-3 text-xs text-muted-foreground">
      <button
        type="button"
        className="hover:text-foreground hover:underline"
        onClick={() => router.push("/impressum")}
      >
        Impressum
      </button>
      <span aria-hidden>·</span>
      <button
        type="button"
        className="hover:text-foreground hover:underline"
        onClick={() => router.push("/datenschutz")}
      >
        Datenschutz
      </button>
    </div>
  );
}

export default LegalFooterLinks;
