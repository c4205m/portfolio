import { Link } from "react-router-dom";
import { site, useLang } from "../i18n";
import { externalUrl } from "../asset";

export function Footer() {
  const lang = useLang();
  const prefix = `/${lang}`;
  const tr = site.componentTranslations.footer;

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>{site.brand}</h3>
          <p>{tr.slogan[lang]}</p>
        </div>

        <div className="footer-links">
          <div>
            <h4>{tr.navi[lang]}</h4>
            {site.navigation.map((item) => (
              <Link key={item.url} to={`${prefix}${item.url}`}>
                {item.label[lang]}
              </Link>
            ))}
          </div>

          <div>
            <h4>{tr.social[lang]}</h4>
            {site.social.map((item) => (
              <a key={item.url} href={externalUrl(item.url)}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} {site.brand}. {tr.bottom[lang]}
        </p>
      </div>
    </footer>
  );
}
