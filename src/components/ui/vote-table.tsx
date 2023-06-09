import { ReactNode } from "react";

export default function Table({
	setup,
	children,
}: {
	children: ReactNode;
	setup: number[];
}) {
	return (
		<div className="h-[113px]">
			<table className="border-separate border-spacing-px mx-auto">
				<thead>
					<tr className="text-[10px] text-center">
						<th colSpan={setup.reduce((acc, curr) => acc + curr, 1)}></th>
						<th className="border-s-8 border-transparent">Tecnicas</th>
						<th>Flow</th>
						<th>Escena</th>
						<th>Total</th>
					</tr>
				</thead>
				{children}
			</table>
		</div>
	);
}
