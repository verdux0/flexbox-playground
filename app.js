(function () {
  // 1) References to DOM elements (controls + output + preview)
  const displaySelect = document.getElementById('displaySelect');

  const flexGroup = document.getElementById('flexGroup');
  const flexDirection = document.getElementById('flexDirection');
  const justifyContent = document.getElementById('justifyContent');
  const alignItems = document.getElementById('alignItems');
  const flexWrap = document.getElementById('flexWrap');
  const gapValue = document.getElementById('gapValue');
  const gapUnit = document.getElementById('gapUnit');

  const positionSelect = document.getElementById('positionSelect');
  const offsetsGroup = document.getElementById('offsetsGroup');
  const topValue = document.getElementById('topValue');
  const topUnit = document.getElementById('topUnit');
  const rightValue = document.getElementById('rightValue');
  const rightUnit = document.getElementById('rightUnit');
  const bottomValue = document.getElementById('bottomValue');
  const bottomUnit = document.getElementById('bottomUnit');
  const leftValue = document.getElementById('leftValue');
  const leftUnit = document.getElementById('leftUnit');

  const customCss = document.getElementById('customCss');

  const cssOutput = document.getElementById('cssOutput');
  const copyBtn = document.getElementById('copyBtn');

  const generatedStyleTag = document.getElementById('generatedStyle');
  const previewBox = document.getElementById('previewBox');
  const previewStage = document.getElementById('previewStage');

  // 2) Central app state (what the user selects in the UI)
  const state = {
    display: displaySelect.value,
    flex: {
      direction: flexDirection.value,
      justify: justifyContent.value,
      alignItems: alignItems.value,
      wrap: flexWrap.value,
      gap: '',
    },
    position: positionSelect.value,
    offsets: {
      top: '',
      right: '',
      bottom: '',
      left: '',
    },
    custom: '',
  };

  // 3) Utilities (helpers)
  function withUnit(value, unit) {
    if (value === '' || value === null || Number.isNaN(Number(value))) return '';
    return `${value}${unit}`;
  }

  function normalizeCustomDeclarations(text) {
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const cleaned = lines
      .map((line) => {
        if (line.startsWith('/*') || line.startsWith('//')) return null;
        if (line.includes('{') || line.includes('}')) return null;
        if (!line.includes(':')) return null;
        return line.endsWith(';') ? line : `${line};`;
      })
      .filter(Boolean);

    return cleaned.join('\n  ');
  }

  // 4) Build final CSS string from the state
  function buildCss() {
    const declarations = [];

    declarations.push(`display: ${state.display};`);

    if (state.display.includes('flex')) {
      declarations.push(`flex-direction: ${state.flex.direction};`);
      declarations.push(`justify-content: ${state.flex.justify};`);
      declarations.push(`align-items: ${state.flex.alignItems};`);
      declarations.push(`flex-wrap: ${state.flex.wrap};`);
      if (state.flex.gap) declarations.push(`gap: ${state.flex.gap};`);
    } else {
      if (state.flex.gap) declarations.push(`gap: ${state.flex.gap};`);
    }

    declarations.push(`position: ${state.position};`);

    if (state.offsets.top) declarations.push(`top: ${state.offsets.top};`);
    if (state.offsets.right) declarations.push(`right: ${state.offsets.right};`);
    if (state.offsets.bottom) declarations.push(`bottom: ${state.offsets.bottom};`);
    if (state.offsets.left) declarations.push(`left: ${state.offsets.left};`);

    const customDecl = normalizeCustomDeclarations(state.custom);

    const bodyLines =
      declarations.map((d) => `  ${d}`).join('\n') +
      (customDecl ? `\n  /* Custom CSS */\n  ${customDecl}` : '');

    return `#previewBox {\n${bodyLines}\n}`;
  }

  // 5) Render: apply CSS to the preview and print it in the output
  function renderCss() {
    const css = buildCss();
    generatedStyleTag.textContent = css;
    cssOutput.textContent = css;
  }

  // 6) Sync state reading current form values
  function updateState() {
    state.display = displaySelect.value;

    state.flex.direction = flexDirection.value;
    state.flex.justify = justifyContent.value;
    state.flex.alignItems = alignItems.value;
    state.flex.wrap = flexWrap.value;

    const gap = gapValue.value.trim();
    state.flex.gap = gap !== '' ? withUnit(gap, gapUnit.value) : '';

    state.position = positionSelect.value;

    const tv = topValue.value.trim();
    const rv = rightValue.value.trim();
    const bv = bottomValue.value.trim();
    const lv = leftValue.value.trim();

    state.offsets.top = tv !== '' ? withUnit(tv, topUnit.value) : '';
    state.offsets.right = rv !== '' ? withUnit(rv, rightUnit.value) : '';
    state.offsets.bottom = bv !== '' ? withUnit(bv, bottomUnit.value) : '';
    state.offsets.left = lv !== '' ? withUnit(lv, leftUnit.value) : '';

    state.custom = customCss.value;
  }

  // 7) UI control: enable/disable inputs based on display/position
  function updateUIVisibility() {
    const isFlex = displaySelect.value.includes('flex');
    flexGroup.style.display = isFlex ? '' : '';

    flexDirection.disabled = !isFlex;
    justifyContent.disabled = !isFlex;
    alignItems.disabled = !isFlex;
    flexWrap.disabled = !isFlex;

    const disableOffsets = positionSelect.value === 'static';
    [
      topValue,
      rightValue,
      bottomValue,
      leftValue,
      topUnit,
      rightUnit,
      bottomUnit,
      leftUnit,
    ].forEach((el) => (el.disabled = disableOffsets));

    offsetsGroup.style.opacity = disableOffsets ? 0.6 : 1;
  }

  // 8) Form events: recalculate state + UI + CSS on each change
  [
    displaySelect,
    flexDirection,
    justifyContent,
    alignItems,
    flexWrap,
    gapValue,
    gapUnit,
    positionSelect,
    topValue,
    topUnit,
    rightValue,
    rightUnit,
    bottomValue,
    bottomUnit,
    leftValue,
    leftUnit,
    customCss,
  ].forEach((el) => {
    const evt =
      el.tagName === 'SELECT' || el === gapUnit || el === topUnit ? 'change' : 'input';

    el.addEventListener(evt, () => {
      updateState();
      updateUIVisibility();
      renderCss();
    });
  });

  // 9) Copy button: copy the generated CSS to the clipboard (with fallback)
  copyBtn.addEventListener('click', async () => {
    const text = cssOutput.textContent;

    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => (copyBtn.textContent = 'Copy CSS'), 1200);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(cssOutput);

      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);

      try {
        document.execCommand('copy');
        copyBtn.textContent = 'Copied!';
      } catch {
        copyBtn.textContent = 'Selected';
      }

      setTimeout(() => (copyBtn.textContent = 'Copy CSS'), 1200);
      sel.removeAllRanges();
    }
  });

  // 10) Drag & drop of previewBox when position is absolute/fixed
  (function enableDrag() {
    let dragging = false;
    let startX = 0,
      startY = 0;
    let startLeft = 0,
      startTop = 0;

    function onPointerDown(e) {
      const isDraggable = ['absolute', 'fixed'].includes(state.position);
      if (!isDraggable) return;

      dragging = true;
      previewBox.setPointerCapture(e.pointerId);

      const rect = previewBox.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;

      const stageRect = previewStage.getBoundingClientRect();
      startLeft = rect.left - stageRect.left + previewStage.scrollLeft;
      startTop = rect.top - stageRect.top + previewStage.scrollTop;

      e.preventDefault();
    }

    function onPointerMove(e) {
      if (!dragging) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      state.offsets.left = `${Math.round(startLeft + dx)}px`;
      state.offsets.top = `${Math.round(startTop + dy)}px`;

      leftValue.value = parseInt(state.offsets.left, 10);
      leftUnit.value = 'px';
      topValue.value = parseInt(state.offsets.top, 10);
      topUnit.value = 'px';

      renderCss();
    }

    function onPointerUp(e) {
      if (!dragging) return;
      dragging = false;
      previewBox.releasePointerCapture(e.pointerId);
    }

    previewBox.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  })();

  // 11) Initialization: sync everything on load
  updateState();
  updateUIVisibility();
  renderCss();
})(); 