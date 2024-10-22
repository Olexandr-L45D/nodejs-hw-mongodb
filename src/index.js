// на початку пустий
// Тепер у файлі src/index.js ми створимо функцію bootstrap,
//  яка буде ініціалізувати підключення до бази даних, після чого запускати сервер.
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

