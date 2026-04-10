import { cn } from "@/lib/utils";

interface PageHeaderProps {
	title: string;
	description?: string;
	className?: string;
	children?: React.ReactNode;
}

export function PageHeader({
	title,
	description,
	className,
	children,
}: PageHeaderProps) {
	return (
		<div className={cn("flex items-start justify-between gap-4", className)}>
			<div>
				<h1 className="text-4xl font-bold tracking-tight text-primary">
					{title}
				</h1>
				{description && (
					<p className="mt-1 text-sm text-muted-foreground">{description}</p>
				)}
			</div>
			{children && (
				<div className="flex items-center gap-2 shrink-0">{children}</div>
			)}
		</div>
	);
}
