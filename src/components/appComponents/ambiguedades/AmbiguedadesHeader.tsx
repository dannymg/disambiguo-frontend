import PageHeader from "@/components/common/PageHeader";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function AmbiguedadesHeader({ title, subtitle }: HeaderProps) {
  return <PageHeader title={title} subtitle={subtitle} />;
}
