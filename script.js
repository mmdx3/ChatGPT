const chatinput = document.querySelector('#chat-input');
const sendBtn = document.querySelector('#send-btn');
const deleteBtn = document.querySelector('#delete-btn');
const lightMOde = document.querySelector('#light-mode');
const chatContainer = document.querySelector('.chat-container');

let UserText = null;
const API_KEY = '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';
const createElement = (html, className) => {
    const chatDiv = document.createElement('div');
    chatDiv.classList.add('chat', className);
    chatDiv.innerHTML = html;
    return chatDiv;
}

chatinput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        HandleOutGoingChat()
    }
})


const loadDetaFromLocalStorage = () => {
    const themeColor = localStorage.getItem('theme');
    if (localStorage.getItem('theme') === 'dark_mode') {
        document.body.classList.remove('light_mode');
        localStorage.setItem('theme', "dark_mode");
        lightMOde.innerHTML = 'light_mode';
    } else {
        document.body.classList.add('light_mode');
        localStorage.setItem('theme', "light_mode");
        lightMOde.innerHTML = 'dark_mode';
    }
    const defultText = `
        <div class="defult-text">
            <h1>چت جی پی تی ایرانی</h1>
            <span>ساخته شده توسط محمد جلال آبادی از نیشابور</span>
            <p>گفت و گو را شروع کنید و قدرت هوش مصنوعی رو کشف کنید </br> سابقه چت های شما در اینجا نمایش داده میشود</p>
        </div>
    `;

    chatContainer.innerHTML = localStorage.getItem('all-chats') || defultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);

}

loadDetaFromLocalStorage();

lightMOde.addEventListener('click', () => {
    if (localStorage.getItem('theme')) {
        if (localStorage.getItem('theme') === 'light_mode') {
            document.body.classList.remove('light_mode');
            localStorage.setItem('theme', "dark_mode");
            lightMOde.innerHTML = 'light_mode';
        } else {
            document.body.classList.add('light_mode');
            localStorage.setItem('theme', "light_mode");
            lightMOde.innerHTML = 'dark_mode';
        }
    }else {
        document.body.classList.add('light_mode');
        localStorage.setItem('theme', "light_mode");
        lightMOde.innerHTML = 'dark_mode';
    }
})

const getChatResponse = async (inComingChatDiv) => {
    const API_URL = 'https://api.openai.com/v1/completions';
    const pElement = document.createElement('p');
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: UserText,
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null
        })
    }
    try {
        const response = await (await fetch(API_URL, requestOptions)).json();
        pElement.textContent = response.choices[0].text.trim();


    } catch (error) {
        pElement.classList.add('error');
        pElement.textContent = " هنگام دریافت پاسخ مشکلی پیش آمد :(  لطفا دوباره امتحان کنید"
    }
    inComingChatDiv.querySelector('.typing-animation').remove();
    inComingChatDiv.querySelector('.chat-details').appendChild(pElement);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    localStorage.setItem('all-chats', chatContainer.innerHTML);
}

const copyResponce = (copyBtn) => {
    const responceText = copyBtn.parentElement.querySelector('p');
    navigator.clipboard.writeText(responceText.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => {
        copyBtn.textContent = "content_copy";
    }, 1000)
}
const showTypingAnimation = () => {
    const html = `
    <div class="chat-content">
    <div class="chat-details">
        <img src="image/chatGPT.png" alt="">
        <div class="typing-animation">
            <div class="typing-dot" style="--delay: 0.2s;"></div>
            <div class="typing-dot" style="--delay: 0.3s;"></div>
            <div class="typing-dot" style="--delay: 0.4s;"></div>
        </div>
    </div>
    <span onclick="copyResponce(this)" class="material-symbols-rounded ">content_copy</span>
    </div>`;
    const inComingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(inComingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(inComingChatDiv);
}

const HandleOutGoingChat = () => {
    UserText = chatinput.value.trim()
    if (!UserText) return;
    const html = `
    <div class="chat-content">
        <div class="chat-details">
            <img src="image/user.JPG" alt="">
            <p></p>
        </div>
    </div>`;
    const outGoingChatDiv = createElement(html, "outgoing");
    outGoingChatDiv.querySelector('p').textContent = UserText;
    chatContainer.appendChild(outGoingChatDiv);
    document.querySelector('.defult-text')?.remove();
    chatinput.value = '';
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}

deleteBtn.addEventListener('click', () => {
    if (confirm('آیا مطمعنی که میخوای همه چت ها پاک بشه؟')) {
        localStorage.removeItem('all-chats');
        loadDetaFromLocalStorage();
    }
})
sendBtn.addEventListener('click', HandleOutGoingChat);
