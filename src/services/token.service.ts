import { Cookies } from "react-cookie";
import moment from "moment";
import { COOKIE_DOMAIN, SOCKET, MAIN_WEBSITE, API } from "../config";

class TokenService {
  private userKey: string = "sessionToken";
  private guestKey: string = "guestSessionToken";

  // private readonly cookieOptions = () => ({ path: '/', expires: moment().add(1, 'years').toDate(), domain: `localhost` })
  private readonly cookieOptions = () => ({
    path: "/",
    expires: moment().add(1, "years").toDate(),
    domain:
      window.location.hostname !== "localhost" ? COOKIE_DOMAIN : "localhost",
  });

  set user(token: string) {
    const cookies = new Cookies();
    if (token) {
      cookies.set(this.userKey, token, this.cookieOptions());
    }
  }

  get user(): string {
    const cookies = new Cookies();
    const token = cookies.get(this.userKey);
    if (!token) {
      return null;
    }
    return token;
  }

  set guest(token: string) {
    console.log("Set_Guest_Token _" + token);
    console.log("cookies_Domain_setting_token_Guest _" + COOKIE_DOMAIN);
    console.log("socket_Guest_" + SOCKET);
    console.log("MAIN_WEBSITE_Guest_" + MAIN_WEBSITE);
    console.log("API_Guest_" + API);
    const cookies = new Cookies();
    if (token) {
      console.log(cookies, token, COOKIE_DOMAIN);
      cookies.set(this.guestKey, token, this.cookieOptions());
    }
  }

  get guest(): string {
    const cookies = new Cookies();
    const token = cookies.get(this.guestKey);
    if (!token) {
      return null;
    }
    return token;
  }

  get io(): string {
    const cookies = new Cookies();
    return cookies.get("io");
  }

  remove = (): void => {
    const cookies = new Cookies();
    if (cookies.get(this.userKey)) {
      cookies.remove(this.userKey, this.cookieOptions());
    }
    if (cookies.get(this.guestKey)) {
      cookies.remove(this.guestKey, this.cookieOptions());
    }
  };
}

const TOKEN = new TokenService();
export default TOKEN;
