import {Dashboard} from "./components/dashboard.js";
import {NotPageFound} from "./components/404.js";
import {Login} from "./components/login.js";
import {SignUp} from "./components/sign-up.js";

export class Router {
  constructor() {
    // Получаем элементы
    this.titilePageElement = document.getElementById('title')
    this.contentPageElement = document.getElementById('content')


    this.initEvent()

    // Набор страниц со свойствами
    this.routes = [
      {
        route: '/',
        title: 'Dashboard',
        filePathTemplate: '/templates/dashboard.html',
        load: () => {
          new Dashboard()
        }
      },
      {
        route: '/404',
        title: 'No page found',
        filePathTemplate: '/templates/404.html',
        load: () => {
          new NotPageFound()
        }
      },
      {
        route: '/login',
        title: 'Login',
        filePathTemplate: '/templates/login.html',
        load: () => {
          new Login()
        }
      },
      {
        route: '/sign-up',
        title: 'Sign In',
        filePathTemplate: '/templates/sign-up.html',
        load: () => {
          new SignUp()
        }
      },
    ]
  }

  initEvent() {
    // Добавляем событие на загрузку контента при открытии страницы
    window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this))
    // Добавляем событие на отлов изменения url при переходе на другою страницу
    window.addEventListener('popstate', this.activateRoute.bind(this))
  }

  async activateRoute() {
    // Определяем url какой открыл пользователь
    const urlRoute = window.location.pathname
    // Находим нужный роут
    const newRoute = this.routes.find(item => item.route === urlRoute)

    // Проверяем если newRoute существует то мы делаем одно действие
    // Если в newRoute пусто то мы перенаправляем на страницу 404
    if (newRoute) {
      // Делаем проверку на то что в newRoute есть данные title и выполняем действия
      if (newRoute.title) {
        // Присваиваем название страницы в title. В зависимости от той страницы на которой мы находимся
        this.titilePageElement.innerText = `${newRoute.title} | Freelance Studio`
      }
      //Делаем проверку на то что в newRoute есть данные filePathTemplate. Подгружаем контент на страницу на которой мы находимся
      if (newRoute.filePathTemplate) {
        // Присваиваем полученный контент. В зависимости от той страницы на которой мы находимся
        this.contentPageElement.innerHTML = await fetch(newRoute.filePathTemplate)
          .then(response => response.text())
      }
      //Делаем проверку на то что в newRoute есть функция .load и newRoute.load есть function. Подгружаем функционал на страницу на которой мы находимся
      if (newRoute.load && typeof newRoute.load === 'function') {
        // Вызываем функцию load
        newRoute.load()
      }

    } else {
      window.location = '/404'
    }
  }
}

