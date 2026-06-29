import logo from '../assets/logo-do-gira.webp';

export function Login({ onLogin }) {
  function handleSubmit(event) {
    event.preventDefault();
    onLogin();
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-label="Login administrativo">
        <div className="login-card__logo-wrap">
          <img src={logo} alt="Do Gira" className="login-card__logo" />
        </div>

        <div className="login-card__header">
          <span>Administração</span>
          <h1>Entrar no sistema</h1>
          <p>Controle inicial de produtos, lanches e configurações do mini-mercado.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Usuário
            <input type="text" placeholder="admin@dogira.com" autoComplete="username" />
          </label>

          <label>
            Senha
            <input type="password" placeholder="••••••••" autoComplete="current-password" />
          </label>

          <button type="submit" className="button button--primary button--full">
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}
