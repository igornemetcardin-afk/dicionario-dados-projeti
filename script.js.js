document.addEventListener('DOMContentLoaded', () => {
  /* ========================================================================
     1. ALTERNÂNCIA DE TEMA (LIGHT / DARK MODE)
     ======================================================================== */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');
  const htmlEl = document.documentElement;

  const savedTheme = localStorage.getItem('projeti_dict_theme') || 'light';
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('projeti_dict_theme', next);
  });

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-sun';
      themeLabel.textContent = 'Modo Claro';
    } else {
      themeIcon.className = 'fa-solid fa-moon';
      themeLabel.textContent = 'Modo Escuro';
    }
  }

  /* ========================================================================
     2. SIDEBAR RESPONSIVA & NAVEGAÇÃO ATIVA
     ======================================================================== */
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const navLinks = document.querySelectorAll('.nav-link');

  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
      if (window.innerWidth <= 960) {
        sidebar.classList.remove('open');
      }
    });
  });

  /* ========================================================================
     3. BARRA DE PESQUISA EM TEMPO REAL (TABELAS E COLUNAS)
     ======================================================================== */
  const searchInput = document.getElementById('dictionarySearch');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const tableSections = document.querySelectorAll('.table-section');
  const noResultsMessage = document.getElementById('noResultsMessage');

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    clearSearchBtn.hidden = query.length === 0;
    filterDictionary(query);
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.hidden = true;
    filterDictionary('');
    searchInput.focus();
  });

  function filterDictionary(query) {
    let visibleSectionsCount = 0;

    tableSections.forEach((section) => {
      const tableName = section.getAttribute('data-table-name').toLowerCase();
      const rows = section.querySelectorAll('tbody tr');
      const tableMatchesDirectly = tableName.includes(query);
      let visibleRowsCount = 0;

      rows.forEach((row) => {
        const rowText = row.textContent.toLowerCase();
        if (query === '' || tableMatchesDirectly || rowText.includes(query)) {
          row.style.display = '';
          visibleRowsCount++;
        } else {
          row.style.display = 'none';
        }
      });

      if (visibleRowsCount > 0) {
        section.style.display = '';
        visibleSectionsCount++;
      } else {
        section.style.display = 'none';
      }
    });

    noResultsMessage.hidden = visibleSectionsCount > 0;
  }

  /* ========================================================================
     4. MODAL DO DER COM PANZOOM.JS (ZOOM + PAN + RESET)
     ======================================================================== */
  const derModal = document.getElementById('derModal');
  const openDerModalBtn = document.getElementById('openDerModalBtn');
  const closeDerModalBtn = document.getElementById('closeDerModalBtn');
  const panzoomContainer = document.getElementById('panzoomContainer');
  const derViewport = document.getElementById('derViewport');
  const zoomInBtn = document.getElementById('zoomInBtn');
  const zoomOutBtn = document.getElementById('zoomOutBtn');
  const zoomResetBtn = document.getElementById('zoomResetBtn');

  let panzoomInstance = null;

  openDerModalBtn.addEventListener('click', () => {
    derModal.hidden = false;
    document.body.style.overflow = 'hidden';

    if (!panzoomInstance && typeof Panzoom !== 'undefined') {
      panzoomInstance = Panzoom(panzoomContainer, {
        maxScale: 5,
        minScale: 0.5,
        step: 0.25,
        contain: 'outside'
      });

      derViewport.addEventListener('wheel', (event) => {
        event.preventDefault();
        panzoomInstance.zoomWithWheel(event);
      }, { passive: false });
    } else if (panzoomInstance) {
      panzoomInstance.reset();
    }
  });

  zoomInBtn.addEventListener('click', () => {
    if (panzoomInstance) panzoomInstance.zoomIn();
  });

  zoomOutBtn.addEventListener('click', () => {
    if (panzoomInstance) panzoomInstance.zoomOut();
  });

  zoomResetBtn.addEventListener('click', () => {
    if (panzoomInstance) panzoomInstance.reset();
  });

  closeDerModalBtn.addEventListener('click', closeDerModal);

  function closeDerModal() {
    derModal.hidden = true;
    document.body.style.overflow = '';
  }

  /* ========================================================================
     5. MODAL DO SCRIPT DDL (SYNTAX HIGHLIGHTING + COPIAR)
     ======================================================================== */
  const ddlModal = document.getElementById('ddlModal');
  const openDdlModalBtn = document.getElementById('openDdlModalBtn');
  const closeDdlModalBtn = document.getElementById('closeDdlModalBtn');
  const copyDdlBtn = document.getElementById('copyDdlBtn');
  const ddlCodeBlock = document.getElementById('ddlCodeBlock');

  openDdlModalBtn.addEventListener('click', () => {
    ddlModal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (typeof Prism !== 'undefined') {
      Prism.highlightElement(ddlCodeBlock);
    }
  });

  closeDdlModalBtn.addEventListener('click', closeDdlModal);

  function closeDdlModal() {
    ddlModal.hidden = true;
    document.body.style.overflow = '';
  }

  copyDdlBtn.addEventListener('click', async () => {
    const rawSql = ddlCodeBlock.textContent;
    try {
      await navigator.clipboard.writeText(rawSql);
      const originalHtml = copyDdlBtn.innerHTML;
      copyDdlBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!';
      setTimeout(() => {
        copyDdlBtn.innerHTML = originalHtml;
      }, 2200);
    } catch (err) {
      alert('Não foi possível copiar o script automaticamente. Selecione o texto manualmente.');
    }
  });

  /* Fechar modais ao clicar fora ou pressionar ESC */
  [derModal, ddlModal].forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.hidden = true;
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDerModal();
      closeDdlModal();
    }
  });
});