export const name = 'Multi-context: ctx.a creates, ctx.b sees the new record';
export const tags = ['multi-context'];
export const contexts = ['a', 'b'];
export const timeout = 120000;

export default async function({ a, b, assert, step, log }) {

  const unique = 'MultiCtx-' + Date.now();

  await step('a: открыть Контрагенты, создать новую запись', async () => {
    await a.navigateSection('Склад');
    await a.openCommand('Контрагенты');
    await a.clickElement('Создать');
    await a.fillField('Наименование', unique);
    await a.clickElement('Записать и закрыть');
    log(`a created: ${unique}`);
  });

  await step('b: открыть Контрагенты в независимой сессии', async () => {
    await b.navigateSection('Склад');
    const state = await b.openCommand('Контрагенты');
    assert.ok(state.form != null, 'Список должен открыться в b');
  });

  await step('b: найти запись через filterList', async () => {
    await b.filterList(unique);
    const t = await b.readTable();
    log(`b: total=${t.total} rows=${t.rows?.length}`);
    assert.tableHasRow(t, r => r['Наименование'] === unique);
    await b.unfilterList();
    await b.closeForm();
  });

  await step('a: cleanup — удалить запись', async () => {
    // a's list view is still open from step 1's "Записать и закрыть" returning to list
    await a.filterList(unique);
    await a.clickElement(unique);
    const page = await a.getPage();
    await page.keyboard.press('Delete');
    // confirmation dialog → Yes
    await a.clickElement('Да');
    await a.unfilterList();
    await a.closeForm();
    log('a deleted');
  });
}
