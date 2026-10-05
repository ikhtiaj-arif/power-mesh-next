import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OverviewHeader } from "@/components/modules/dashboard/overview-header";

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-6">
      <OverviewHeader title={title} description={description} />
      <Card>
        <CardHeader>
          <CardTitle>Coming next</CardTitle>
          <CardDescription>
            This screen is wired into the role shell. Feature APIs will fill it
            in later phases.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
