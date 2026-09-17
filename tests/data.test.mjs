import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateData,storageSummary} from '../dist/model-data.js';
const data=JSON.parse(await readFile(new URL('../dist/terminal.json',import.meta.url),'utf8'));
test('All facilities have valid unique identities and positive dimensions',()=>assert.equal(validateData(data),data));
test('Tank schedule matches the source counts and stored capacities',()=>{
 assert.deepEqual(storageSummary(data.assets),{productTanks:6,productCapacityM3:15000,fireWaterCapacityM3:4928});
 for(const [prefix,count,diameter,height,capacity] of [['HSD-',2,24,14.4,5000],['MS-',2,20,14.4,2000],['SLOP-',2,11.5,8,500],['FW-0',2,17.5,12,2464]]){const tanks=data.assets.filter(a=>a.id.startsWith(prefix));assert.equal(tanks.length,count);for(const a of tanks){assert.equal(a.diameterM,diameter);assert.equal(a.heightM,height);assert.equal(a.capacityM3,capacity);}}
});
test('Scheduled underground vessels remain distinct from above-ground totals',()=>{
 const vessels=data.assets.filter(a=>a.kind==='underground');assert.equal(vessels.length,3);assert.equal(vessels.reduce((sum,a)=>sum+a.capacityM3,0),340);assert.equal(data.assets.find(a=>a.id==='UG-ETH').lengthM,16);
});
test('Bad data is rejected rather than silently displayed',()=>{
 const duplicate=structuredClone(data);duplicate.assets.push(duplicate.assets[0]);assert.throws(()=>validateData(duplicate),/Duplicate/);
 const bad=structuredClone(data);bad.assets[0].diameterM=-1;assert.throws(()=>validateData(bad),/diameterM/);
 const missing=structuredClone(data);missing.assets[0].group='missing';assert.throws(()=>validateData(missing),/Unknown/);
});
