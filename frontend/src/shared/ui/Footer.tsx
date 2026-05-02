function Footer() {
    return (
      <footer className="border-t border-neutral-200 bg-white px-4 py-8">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 text-sm text-neutral-500">
          <p>© 2026 Focus With Me</p>
  
          <div className="flex items-center gap-4">
            <button type="button" className="hover:text-neutral-900">
              О проекте
            </button>
            <button type="button" className="hover:text-neutral-900">
              Поддержка
            </button>
          </div>
        </div>
      </footer>
    );
  }


export default Footer;