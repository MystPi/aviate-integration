const posts = document.querySelectorAll('.blockpost');
const cache = Object.create(null);

posts.forEach(async (post) => {
  const username = post.querySelector('.username').innerText;
  const left = post.querySelector('.postleft').children[0];

  const status = await (cache[username] ||
    (cache[username] = fetchStatus(username)));

  if (status) {
    const i = document.createElement('i');
    const img = document.createElement('img');
    const a = document.createElement('a');

    i.innerText = status;
    img.src = chrome.runtime.getURL('icons/icon.svg');
    img.width = 13;
    img.height = 13;
    img.style.marginRight = '0.25em';
    img.style.verticalAlign = 'middle';
    a.href = 'https://aviateapp.eu.org';
    a.target = '_blank';
    a.appendChild(img);
    left.appendChild(document.createElement('br'));
    left.appendChild(a);
    left.appendChild(i);

    // Scratch Addons (https://scratchaddons.com) 'my-ocular integration' workarounds

    waitForElm(left, 'i[style]').then((el) => {
      el.remove();
    });

    waitForElm(left, 'br[style]').then((el) => {
      el.remove();
    });

    waitForElm(left, '.my-ocular-dot').then((el) => {
      el.title =
        'This is a customized color from ocular, displayed by Scratch Addons. You can set your own at https://ocular.jeffalo.net/dashboard.';
      // Move element to the bottom of its parent
      el.parentNode.appendChild(el);
    });
  }
});

async function fetchStatus(username) {
  const res = await fetch(`https://aviateapp.eu.org/api/${username}`);
  const { status } = await res.json();
  return status;
}

// https://stackoverflow.com/a/61511955/16343341
function waitForElm(element, selector) {
  return new Promise((resolve) => {
    if (element.querySelector(selector)) {
      return resolve(element.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (element.querySelector(selector)) {
        resolve(element.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(element, {
      childList: true,
      subtree: true,
    });
  });
}
