
// Тепер у файлі src/index.js ми створимо функцію bootstrap, яка буде ініціалізувати підключення до бази даних, після чого запускати сервер.
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

const bootstrap = async () => {
    await initMongoConnection();
    setupServer();
};
bootstrap();


// litvinenko1978aleks@gmail.com
// для деплою на Render нижче пароль
// password to Render (_=sd$xeUh%9%%Un)
// password to mongodb:  8eTbBjmX6iYi0lPO
// 8eTbBjmX6iYi0lPO
// link to mongodb
// mongodb + srv://litvinenko1978aleks:8eTbBjmX6iYi0lPO@cluster0.xdk28.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

// API key to BREVO = xkeysib - 2b237ed81d4253bd91cf66cb162760c211eefba83bb6f53d253def9a86bd9a28 - NeGduPkpCl1WVaEr
