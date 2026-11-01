// @vitest-environment jsdom
import { it,expect,vi } from 'vitest';
import { mountPracticeFeedback } from '../../src/ui/playerFeedback.js';

it('exports explicit player answers and goal evidence only after all questions are answered',()=>{
 const container=document.createElement('div'),download=vi.fn(),summary=Object.freeze({family:'beam',seconds:30,dodged:9,hits:1}),before=localStorage.length;mountPracticeFeedback(container,{family:'beam',summary,achieved:true,download});const button=container.querySelector('button');expect(button.disabled).toBe(true);button.click();expect(download).not.toHaveBeenCalled();
 for(const select of container.querySelectorAll('select')){select.value=select.options[1].value;select.dispatchEvent(new Event('change',{bubbles:true}));}expect(button.disabled).toBe(false);button.click();expect(download).toHaveBeenCalledOnce();expect(download.mock.calls[0][2]).toMatchObject({format:'rift-practice-feedback-v1',family:'beam',goal:{seconds:30,dodges:8},goalAchieved:true,round:summary,playerFeedback:{difficulty:'easy',clarity:'clear',controls:'responsive'}});expect(localStorage.length).toBe(before);expect(container.querySelector('details').open).toBe(false);
});
