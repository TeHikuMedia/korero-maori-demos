function isMobile(){
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Mobile|SamsungBrowser|Opera Mini/i.test(navigator.userAgent)) {
  return true
  } else {
  return false
  }
}

exports.isMobile = isMobile()