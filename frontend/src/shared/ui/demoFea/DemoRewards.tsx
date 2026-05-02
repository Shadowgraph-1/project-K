import { REWARD_ITEMS } from "@/const/rewardItems";
import { CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";

type DemoRewardsProps = {
  completedTodoCount: number;
  todoRewardClaimed: boolean;
  onClaimTodoReward: () => void;
};

function DemoRewards({ completedTodoCount, todoRewardClaimed, onClaimTodoReward }: DemoRewardsProps) {
  const [claimedRewards, setClaimedRewards] = useState<boolean[]>(() =>
    REWARD_ITEMS.map((reward) => reward.claimed),
  );

  const claimReward = (index: number) => {
    setClaimedRewards((current) => {
      const next = [...current];
      next[index] = true;
      return next;
    });
  };



  return (
    <div className="space-y-4">
      {REWARD_ITEMS.map((reward, index) => {
        const isTodoReward = reward.type === "todo";

        const canClaim = !isTodoReward || completedTodoCount >= 3;
        const isClaimed = isTodoReward
        ? todoRewardClaimed
        : claimedRewards[index];

        return (
          <div
            key={reward.name}
            className="flex w-full flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-medium text-neutral-950">
                {reward.name}
              </h3>
              {isClaimed ? (
                <CheckCircle2
                  className="shrink-0 text-green-600"
                  size={20}
                  aria-hidden
                />
              ) : (
                <Circle
                  className="shrink-0 text-neutral-400"
                  size={20}
                  aria-hidden
                />
              )}
            </div>
            <p className="text-sm text-neutral-600">{reward.description}</p>
            <button
              type="button"
              disabled={isClaimed || !canClaim}
              onClick={() => {
                if (isTodoReward) {
                    onClaimTodoReward();
                    return;
                }

                claimReward(index);
              }}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                isClaimed
                  ? "cursor-not-allowed bg-green-50 text-green-700"
                  : canClaim
                    ? "bg-neutral-950 text-white hover:bg-neutral-800"
                    : "cursor-not-allowed bg-neutral-100 text-neutral-400"
              }`}
            >
              {isClaimed
                ? "Получено"
                : isTodoReward && !canClaim
                  ? `${completedTodoCount}/3 задачи`
                  : "Получить"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default DemoRewards;
