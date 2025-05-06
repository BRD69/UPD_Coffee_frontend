# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Развертывание на хостинге reg.ru

### Подготовка проекта

1. Создайте production сборку проекта:
```bash
npm run build
```

2. В корне проекта появится папка `dist` с оптимизированными файлами для production.

### Настройка хостинга reg.ru

1. Войдите в панель управления reg.ru
2. Перейдите в раздел "Хостинг" → "Управление сайтом"
3. В разделе "Файлы" откройте File Manager или подключитесь через FTP

### Загрузка файлов

1. Удалите все файлы из корневой директории сайта (обычно это `/public_html/` или `/www/`)
2. Загрузите содержимое папки `dist` в корневую директорию сайта

### Настройка домена

1. В панели управления reg.ru перейдите в раздел "Домены"
2. Выберите ваш домен
3. Убедитесь, что DNS-записи правильно настроены:
   - A-запись должна указывать на IP-адрес вашего хостинга
   - CNAME-запись www должна указывать на ваш домен

### Настройка .htaccess

Создайте файл `.htaccess` в корневой директории сайта со следующим содержимым:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

### Проверка развертывания

1. Откройте ваш сайт в браузере
2. Убедитесь, что все страницы загружаются корректно
3. Проверьте работу всех функций приложения
4. Проверьте, что все API-запросы работают правильно

### Возможные проблемы и решения

1. **Ошибка 404 при обновлении страницы**
   - Убедитесь, что файл `.htaccess` правильно настроен
   - Проверьте, что mod_rewrite включен на сервере

2. **Проблемы с API-запросами**
   - Проверьте настройки CORS на бэкенде
   - Убедитесь, что URL API в production сборке правильный

3. **Медленная загрузка**
   - Проверьте настройки кэширования в `.htaccess`
   - Убедитесь, что все статические файлы правильно сжаты

### Дополнительные рекомендации

1. Настройте SSL-сертификат для безопасного соединения
2. Настройте регулярное резервное копирование
3. Настройте мониторинг доступности сайта
4. Оптимизируйте загрузку изображений и других медиафайлов
