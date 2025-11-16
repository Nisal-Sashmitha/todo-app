import { Block } from '@/store/types';
import { calculateAnalytics } from '@/utils/analytics';

interface Props {
  blocks: Block[];
}

const AnalyticsPanel = ({ blocks }: Props) => {
  const analytics = calculateAnalytics(blocks);
  const completionRatio =
    analytics.completedCount + analytics.pendingCount === 0
      ? 0
      : analytics.completedCount / (analytics.completedCount + analytics.pendingCount);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg w-full md:w-80">
      <h2 className="text-lg font-semibold mb-2">Analytics</h2>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-400">Total hours scheduled</dt>
          <dd className="font-semibold">{analytics.totalHours}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-400">Completed hours</dt>
          <dd className="font-semibold">{analytics.completedHours}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-400">Completed blocks</dt>
          <dd className="font-semibold">{analytics.completedCount}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-400">Pending / carried</dt>
          <dd className="font-semibold">{analytics.pendingCount}</dd>
        </div>
      </dl>
      <div className="mt-4">
        <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">Completion</div>
        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-2 bg-emerald-500"
            style={{ width: `${Math.round(completionRatio * 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-slate-200 mt-2">{analytics.insight}</p>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
