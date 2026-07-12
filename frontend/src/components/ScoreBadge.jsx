function ScoreBadge({ score }) {
  const numeric = Number(score);
  let tier = "low";
  if (numeric >= 80) tier = "high";
  else if (numeric >= 50) tier = "medium";

  return (
    <span className={`score-badge score-badge-${tier}`}>
      {numeric.toFixed(0)}% Compatible
    </span>
  );
}

export default ScoreBadge;
