
module.exports.EndPoints = function (stage) {
  if (stage === 'development')
    return {
      EVENTDESK_API: "http://localhost:9800",
      SHOP_API: "http://localhost:8799",
      ADMIN_API: "http://localhost:9700",
      AUTH_API: "http://localhost:9300",
      KIOSK_API: "http://localhost:8798",
      MEDIA_API: "http://localhost:9400",
      MAIL_API:  "http://localhost:9500"
    }

  return {
    EVENTDESK_API: "https://eventdesk-api.kinora:9800",
    SHOP_API: "https://shop.kinora:8799",
    ADMIN_API: "https://admin.kinora:9700",
    AUTH_API: "https://auth.kinora:9300",
    KIOSK_API: "https://kiosk.kinora:8798",
    MEDIA_API: "https://kiosk.kinora:9400",
    MAIL_API:  "https://mail.kinora:9500"
  }
}
