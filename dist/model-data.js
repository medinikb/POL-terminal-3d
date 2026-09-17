// Keep drawing facts separate from the 3D rendering code.
export function validateData(data){
  if(data.schemaVersion!==1)throw new Error('Unsupported drawing data version.');
  if(!Number.isFinite(data.source.metresPerDrawingPixel)||data.source.metresPerDrawingPixel<=0)throw new Error('Drawing scale must be positive.');
  const groups=new Set(data.groups.map(g=>g.id)),ids=new Set();
  for(const asset of data.assets){
    if(ids.has(asset.id))throw new Error(`Duplicate facility ID: ${asset.id}`);
    ids.add(asset.id);
    if(!groups.has(asset.group))throw new Error(`Unknown facility group: ${asset.group}`);
    if(!Array.isArray(asset.at)||asset.at.length!==2||!asset.at.every(Number.isFinite))throw new Error(`Invalid position: ${asset.id}`);
    for(const key of ['diameterM','heightM','lengthM','capacityM3'])if(asset[key]!==undefined&&(!Number.isFinite(asset[key])||asset[key]<=0))throw new Error(`Invalid ${key}: ${asset.id}`);
  }
  return data;
}
export function storageSummary(assets){
  const tanks=assets.filter(a=>a.kind==='tank'&&a.group==='storage');
  return {productTanks:tanks.length,productCapacityM3:tanks.reduce((n,a)=>n+a.capacityM3,0),fireWaterCapacityM3:assets.filter(a=>a.kind==='tank'&&a.group==='water').reduce((n,a)=>n+a.capacityM3,0)};
}
