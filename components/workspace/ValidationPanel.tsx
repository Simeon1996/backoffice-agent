"use client";

import { motion } from "motion/react";
import type { RuleResult } from "@/lib/engine/validate";
import { Card, CardHeader } from "@/components/ui/Card";
import { RuleResultRow } from "@/components/ui/RuleResultRow";

export function ValidationPanel({ results, shown }: { results: RuleResult[]; shown: boolean }) {
  const fails = results.filter((r) => r.status === "fail").length;
  const warns = results.filter((r) => r.status === "warn").length;
  return (
    <Card>
      <CardHeader
        title="Validation"
        hint={shown ? `${results.length} checks · ${fails} failed, ${warns} advisory` : "Pending extraction"}
      />
      <div className="px-4 py-1.5">
        {!shown ? (
          <div className="py-5 text-center text-[12px] text-[var(--color-muted)]">Rules run once the fields are read.</div>
        ) : (
          results.map((r) => (
            <motion.div key={r.ruleId} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <RuleResultRow result={r} />
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
}
