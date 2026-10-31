import assert from 'node:assert/strict';
import { openBrowserPage } from './cdp.js';

// Seed real official progress in one context, then verify another is pristine.
const first = await openBrowserPage();
let second;
try {
  await first.evaluate(`(async()=>{
    localStorage.setItem('qa-isolation', 'first');
    const {createAttemptRepository}=await import('/src/persistence/attemptRepository.js');
    const {kitingRecord}=await import('/tests/fixtures/kitingRecord.js');
    const repository=createAttemptRepository();
    try { await repository.saveCompletedAttempt(kitingRecord()); }
    finally { repository.close(); }
  })()`);
  second = await openBrowserPage();
  assert.notEqual(first.browserContextId, second.browserContextId);
  assert.equal(await second.evaluate("localStorage.getItem('qa-isolation')"), null);
  await second.go('/profile');
  await second.waitFor("document.querySelectorAll('.rank-badge').length===4");
  assert.equal(await second.evaluate("[...document.querySelectorAll('.rank-badge')].every(b=>b.textContent==='Sem patente')"), true);
  await second.evaluate("localStorage.setItem('qa-isolation', 'second')");
  assert.equal(await first.evaluate("localStorage.getItem('qa-isolation')"), 'first');
  await first.go('/profile');
  await first.waitFor("document.querySelector('.overall-rank').textContent.includes('1/4 avaliadas')");
  const ids = [first.targetId, second.targetId];
  assert.deepEqual(first.errors, []);
  assert.deepEqual(second.errors, []);
  await first.close();
  await second.close();
  const response = await fetch(`${process.env.CDP_URL ?? 'http://127.0.0.1:9222'}/json/list`);
  assert.ok(response.ok);
  assert.equal((await response.json()).some(target => ids.includes(target.id)), false);
  console.log(JSON.stringify({ status: 'PASSOU', isolatedLocalStorage: true, isolatedOfficialProgress: true, contextsDisposed: true }, null, 2));
} finally {
  await first.close();
  await second?.close();
}
