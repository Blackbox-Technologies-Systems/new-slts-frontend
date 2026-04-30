import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PageHeaderProps {
	title: string;
	description?: string;
	className?: string;
	children?: React.ReactNode;
	breadcrumbs?: { label: string; href: string }[];
}

export function PageHeader({
	title,
	description,
	className,
	children,
	breadcrumbs,
}: PageHeaderProps) {
	return (
		<div className={cn("space-y-4", className)}>
			<div className="flex items-start justify-between gap-4">
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">
						{title}
					</h1>
					{breadcrumbs && breadcrumbs.length > 0 && (
						<nav className="flex items-center gap-2 text-sm text-muted-foreground">
							{breadcrumbs.map((crumb, index) => (
								<div key={crumb.href} className="flex items-center gap-2">
									<Link
										href={crumb.href}
										className="hover:text-primary transition-colors"
									>
										{crumb.label}
									</Link>
									{index < breadcrumbs.length - 1 && (
										<ChevronRight className="h-4 w-4" />
									)}
								</div>
							))}
						</nav>
					)}
					{description && (
						<p className="mt-1 text-sm text-muted-foreground">{description}</p>
					)}
				</div>
				{children && (
					<div className="flex items-center gap-2 shrink-0">{children}</div>
				)}
			</div>
		</div>
	);
}
