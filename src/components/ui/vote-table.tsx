import { ReactNode } from "react";

import { RovingTabindexRoot } from "../roving";

export default function TableBody({
	setup,
	children,
	stageName,
}: {
	children: ReactNode;
	setup: number[];
	stageName: string;
}) {
	return (
		<div className="h-[113px] relative">
			<h2 className="text-sm text-destructive absolute -left-4 -top-3">
				{stageName}
			</h2>
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
				<RovingTabindexRoot as="tbody" active={{ rowId: 0, cellId: 0 }}>
					{children}
				</RovingTabindexRoot>
			</table>
		</div>
	);
}
