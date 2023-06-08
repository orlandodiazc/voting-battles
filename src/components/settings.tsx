import { useBoardDispatch, useBoardSelector } from "../hooks/hooks";
import { changePlayerName, toggleOption } from "../redux/slices/boardSlice";

export default function Settings() {
	const playersName = useBoardSelector((state) => state.settings.players);
	const dispatch = useBoardDispatch();
	return (
		<div className="flex gap-2 items-start bg-muted p-2 text-sm flex-wrap">
			<div className="grid gap-2">
				{playersName.map(({ name, id: playerId }) => (
					<div key={playerId} className="text-background">
						<input
							type="text"
							className="w-24 rounded px-2 py-1 bg-primary "
							placeholder={name}
							onChange={(e) =>
								dispatch(
									changePlayerName({ playerId, newName: e.target.value })
								)
							}
						/>
					</div>
				))}
			</div>
			<label className="flex items-center gap-0.5 text-xs leading-none">
				<input
					type="checkbox"
					onChange={() =>
						dispatch(toggleOption({ option: "TOGGLE_STAGE_SUM" }))
					}
				/>
				Ocultar Sumatorias
			</label>
			<label className="flex items-center gap-0.5 text-xs leading-none">
				<input
					type="checkbox"
					onChange={() =>
						dispatch(toggleOption({ option: "TOGGLE_PLAYER_TOTAL" }))
					}
				/>
				Ocultar Total
			</label>
		</div>
	);
}
