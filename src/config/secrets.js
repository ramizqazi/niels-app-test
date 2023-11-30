export const AppVersion = '1.0.0';

export const main_url = 'https://abcindustrialparts.pythonanywhere.com';
export const server_allsearch = 'http://192.168.2.120:3590';

export const server_endpoints = {
  rp_checkout_data_url: main_url + '/get_checkout_rps_app',
  rp_checkout_data_url_renew: main_url + '/get_checkout_rps_app?renew=true',
  rp_checkout_post_img_url: main_url + '/checkout_rps_post_image',

  post_tracking: main_url + '/bridge/api/orderTracking/',

  post_img_url: main_url + '/traffic_external/image_upload',
  get_repair_images_api: server_allsearch + '/get_images_for_rp_api/',
};
