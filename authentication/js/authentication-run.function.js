// runAuthenticationApi('/authentication/apiTest', 'Login_Information')
// async function runAuthenticationApi(url, sectionload) {
//     try {

//         const noCacheUrl = `${url}?timestamp=${new Date().getTime()}`;
//         const response = await fetch(noCacheUrl, {
//             cache: 'no-store'
//         });
//         if (!response.ok) {
//             throw new Error('Unfortunately, a problem has occurred. Please try again later.');
//         }
//         const content = await response.text();
//         const container = document.querySelector(`.${sectionload}`);
//         container.innerHTML = content;

//         const scripts = container.getElementsByTagName("script");
//         for (let i = 0; i < scripts.length; i++) {
//             const scriptTag = document.createElement("script");
//             if (scripts[i].src) {
//                 scriptTag.src = scripts[i].src;
//             } else {
//                 scriptTag.text = scripts[i].textContent;
//             }
//             document.head.appendChild(scriptTag).parentNode.removeChild(scriptTag);
//         }
//     } catch (error) {
//         console.error('A problem has occurred, please be patient.', error);
//     }
// }
// function loadlog() {
//     console.log('fffffffff')
// }
// loadlog();


fetch(`/authentication/apiTest?timestamp=${new Date().getTime()}`, {
    cache: 'no-store'
}, {
    method: 'get',
}).then(response => response.text()).then(text => {
    const container = document.querySelector(`.Login_Information`);
    container.innerHTML = text;

    const scripts = container.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; i++) {
        const scriptTag = document.createElement("script");
        if (scripts[i].src) {
            scriptTag.src = scripts[i].src;
        } else {
            scriptTag.text = scripts[i].textContent;
        }
        document.head.appendChild(scriptTag).parentNode.removeChild(scriptTag);
    }
}).catch(error => console.error(error))
