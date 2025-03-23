window.addEventListener("load", () => {
    const starContainer = document.getElementById("stars");
    const header = document.querySelector(".header");
    const linkItems = document.querySelectorAll(".link-item");
    const newsContainer = document.querySelector(".news ul");
    const containerHeight = starContainer.offsetHeight * 3/5;
    const containerWidth = starContainer.offsetWidth;
    const itemSize = 120;
    const assignedPositions = [];
    const starCount = 5200;

    // 禁用右键菜单
    document.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });

    // 生成背景星星
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.style.position = "absolute";
        star.style.width = `${Math.random() * 2}px`;
        star.style.height = star.style.width;
        star.style.background = "white";
        star.style.borderRadius = "50%";
        star.style.top = Math.random() * 100 + "%";
        star.style.left = Math.random() * 100 + "%";
        star.style.opacity = Math.random();
        starContainer.appendChild(star);
    }

    // 动态加载新闻内容
    async function loadNews() {
        try {
            const response = await fetch("https://aaa.com/news.json");
            const news = await response.json();

            news.forEach(item => {
                const li = document.createElement("li");
                li.innerHTML = `${item.title} <span>${item.status}</span> — ${item.date}`;
                newsContainer.appendChild(li);
            });
        } catch (error) {
            console.error("新闻加载失败：", error);
        }
    }

    loadNews();

    // 检查是否与其他选项重叠
    function isOverlapping(newX, newY, currentItem) {
        return assignedPositions.some(({ x, y, item }) => {
            if (item === currentItem) return false;
            return Math.abs(newX - x) < itemSize && Math.abs(newY - y) < itemSize;
        });
    }

    // 设置选项初始随机位置
    linkItems.forEach((item) => {
        let x, y;

        do {
            x = Math.random() * (containerWidth - itemSize);
            y = Math.random() * (containerHeight - itemSize);
        } while (isOverlapping(x, y, item));

        assignedPositions.push({ x, y, item });
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;

        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        let hasMoved = false;

        // 鼠标按下事件
        item.addEventListener("mousedown", (e) => {
            if (e.button === 0) {
                isDragging = true;
                hasMoved = false;
                offsetX = e.clientX - item.offsetLeft;
                offsetY = e.clientY - item.offsetTop;
            } else if (e.button === 2) {
                const targetUrl = item.dataset.url;
                if (targetUrl) {
                    window.location.href = targetUrl;
                }
            }
        });

        // 鼠标移动事件
        window.addEventListener("mousemove", (e) => {
            if (isDragging) {
                hasMoved = true;

                const newX = Math.max(0, Math.min(containerWidth - itemSize, e.clientX - offsetX));
                const newY = Math.max(0, Math.min(containerHeight - itemSize, e.clientY - offsetY));

                if (!isOverlapping(newX, newY, item)) {
                    item.style.left = `${newX}px`;
                    item.style.top = `${newY}px`;

                    const positionIndex = assignedPositions.findIndex((p) => p.item === item);
                    assignedPositions[positionIndex].x = newX;
                    assignedPositions[positionIndex].y = newY;
                }
            }
        });

        // 鼠标释放事件
        window.addEventListener("mouseup", () => {
            isDragging = false;
        });

        // 单击事件（保持拖动时不触发点击）
        item.addEventListener("click", (e) => {
            if (!hasMoved && e.button === 0) {
                const targetUrl = item.dataset.url;
                if (targetUrl) {
                    window.location.href = targetUrl;
                }
            }
            hasMoved = false; // 重置移动状态
        });
    });

    // 开场动画：标题栏
    setTimeout(() => {
        header.classList.add("visible");

        // 动画：选项淡入
        setTimeout(() => {
            linkItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add("visible");
                }, index * 50);
            });
        }, 150);
    }, 150);
});
