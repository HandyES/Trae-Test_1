export const copyAddress = async (address: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(address);
    return true;
  } catch (err) {
    const textArea = document.createElement('textarea');
    textArea.value = address;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (e) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

export const openNavigation = (address: string) => {
  const encodedAddress = encodeURIComponent(address);
  const gaodeUrl = `https://uri.amap.com/navigation?to=116.397428,39.90923,${encodedAddress}&mode=car&callnative=1`;
  window.open(gaodeUrl, '_blank');
};
