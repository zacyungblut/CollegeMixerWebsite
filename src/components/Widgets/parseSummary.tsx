const parseSummary = (summary: any) => {
  if (!summary) return "";
  const pattern = /(__[^__]*__)|([^__]+)/g;
  const segments = summary.match(pattern);
  if (!segments) {return summary;}
  return segments.map((segment: any, index: any) => {
    if (segment.startsWith('__') && segment.endsWith('__')) {
      return <span key={index} className="text-black bg-clip-text bg-gradient-to-r font-bold">{segment.replace(/_/g, '')}</span>;
    }
    return <span key={index}>{segment} </span>;
  });
};

export default parseSummary