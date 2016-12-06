/**
 * Created by Administrator on 12/6.
 */

const config = {
  app_name: 'iFly-SS-APP'
}

config.baseApi = apiUrl => '/' + config.app_name + '/api' + apiUrl;

export default config;
