'use strict';

function clientDetailFields(fields) {
  return `<dl class="client-detail-fields">${fields.map(([label, value]) =>
    `<div><dt>${esc(label)}</dt><dd>${esc(value || '—')}</dd></div>`).join('')}</dl>`;
}

function clientDetailSection(title, body) {
  return `<section class="client-detail-section"><h3>${esc(title)}</h3>${body}</section>`;
}

function clientDetailChips(values) {
  return values.length
    ? `<ul class="client-detail-chips">${values.map(value => `<li class="chip">${esc(value)}</li>`).join('')}</ul>`
    : '<p class="muted">暂无</p>';
}

function openClientDetail(title, body, actions = '') {
  studioDialog(title, `<div class="client-detail">${body}
    <div class="client-detail-actions"><button type="button" class="btn" data-action="close">关闭</button>${actions}</div>
  </div>`, true);
}

function showKeywordDetails(button) {
  const entry = packages[Number(button.dataset.index)];
  if (!entry) return;
  const [name, id, coreWord, terms] = entry;
  const fields = clientDetailFields([
    ['词包 ID', id], ['类型', '品牌词'], ['核心词', '明日方舟终末地' + coreWord],
    ['创建时间', '2026/09/09']
  ]);
  openClientDetail('明日方舟终末地' + name,
    clientDetailSection('关键词包详情', fields) +
    clientDetailSection(`语义拓展词条（${terms.length}）`, clientDetailChips(terms)) +
    clientDetailSection('自定义生文偏好', '<p class="muted">暂无</p>') +
    clientDetailSection('AI 收录倾向', clientDetailChips(['明日方舟', '终末地', '鹰角网络'])));
}

function previewStudioArticle(id) {
  const article = studioArticles.find(item => item.id === id);
  if (!article) return;
  const { kind, title, keyword, method, created, review, reviewed, status, published, body, images } = article;
  const metadata = clientDetailFields([
    ['关键词包', keyword], ['创作类型', method], ['生成时间', created],
    ['审核时间', reviewed], ['发布时间', published]
  ]);
  const media = images?.length ? `<div class="studio-image-previews">${images.map(image =>
    `<img src="${esc(image.url)}" alt="${esc(image.name)}">`).join('')}</div>` : '';
  const approve = review === 'pending' && status === 'draft'
    ? studioButton('标记审核通过', 'studio-approve', true, `data-id="${esc(id)}"`) : '';
  const editable = kind !== 'video' && !['published', 'scheduled', 'demo', 'generated'].includes(status);
  const editLabel = kind === 'article' ? '编辑文章' : '编辑图文';
  const edit = editable ? studioButton(editLabel, 'studio-preview-edit', false, `data-id="${esc(id)}"`) : '';
  const label = { article: '文章预览', image: '图文预览', video: '视频任务预览' }[kind];
  openClientDetail(label, `<article class="client-preview">
    <div class="studio-preview-meta">${studioTag(review === 'approved' ? 'approved' : 'review')}${studioTag(status)}</div>
    <h3 class="studio-preview-title">${esc(title)}</h3>${metadata}
    ${clientDetailSection('正文', `<div class="studio-preview-body">${esc(body || '此内容尚未生成。')}</div>${media}`)}
  </article>`, edit + approve);
}

function openInclusionDetails(term, fields, answer) {
  const answerBody = answer
    ? `<div class="studio-preview-body">${esc(answer)}</div>`
    : '<p class="muted">当前记录未提供 AI 回答原文。</p>';
  openClientDetail('AI 收录详情',
    clientDetailSection(term, clientDetailFields(fields)) +
    clientDetailSection(answer ? '回答摘要' : '原始回答', answerBody) +
    clientDetailSection('引用来源', '<p class="muted">当前记录未提供引用链接。</p>'));
}

function showInclusionDetails(button) {
  const cells = [...button.closest('tr').cells].slice(0, 5).map(cell => cell.textContent.trim());
  const [type, coreWord, term, platformName, source] = cells;
  openInclusionDetails(term, [
    ['记录编号', button.dataset.index], ['关键词类型', type],
    ['核心关键词', coreWord], ['收录平台', platformName], ['来源', source]
  ]);
}

if (typeof TD_INCLUSION_ROWS !== 'undefined') {
  actions['tool-inclusion-detail'] = button => {
    const row = TD_INCLUSION_ROWS[Number(button.dataset.index)];
    if (!row) return;
    openInclusionDetails(row.expand, [
      ['目标词', row.target], ['词类型', row.type], ['收录平台', row.plat],
      ['终端', row.term], ['更新时间', row.date]
    ], row.ans);
  };
}

actions['studio-preview-edit'] = button => {
  closeDialog();
  actions['studio-edit'](button);
};
