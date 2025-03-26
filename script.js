gsap.registerPlugin(Flip, Draggable);

let dockItemCount = 0;
let closedCount = 0;

const addButtons = () => {
    document.querySelectorAll(".dashboard > div").forEach((div, index) => {
        const h2 = div.querySelector('h2');
        h2.innerHTML += `
            <button class="close">×</button>
            <button class="minimize">-</button>
            <button class="expand">+</button>
        `;
        
        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');
        wrapper.innerHTML = div.innerHTML;
        div.innerHTML = '';
        div.appendChild(wrapper);
    });

    const dock = document.createElement('div');
    dock.id = 'dock';
    dock.innerHTML = Array(7).fill().map(() => '<div></div>').join('');
    document.body.appendChild(dock);

    return Promise.resolve();
};

const addListeners = () => {
    const dockItems = document.querySelectorAll('#dock > div');
    const wrappers = document.querySelectorAll('.wrapper');

    document.querySelectorAll('.close').forEach((button, index) => {
        button.addEventListener('click', () => {
            const wrapper = button.closest('.dashboard > div').querySelector('.wrapper');
            wrapper.classList.add('closed');
            closedCount++;

            if (closedCount >= wrappers.length) {
                setTimeout(() => {
                    wrappers.forEach(w => w.classList.remove('closed'));
                    closedCount = 0;
                }, 2000);
            }
        });
    });

    document.querySelectorAll('.minimize').forEach((button, index) => {
        const wrapper = button.closest('.dashboard > div').querySelector('.wrapper');
        const dockItem = dockItems[index];
        const label = button.closest('.dashboard > div').querySelector('h2').textContent;

        button.addEventListener('click', () => {
            const state = Flip.getState(wrapper);
            dockItem.innerHTML = '';
            dockItem.appendChild(wrapper);
            dockItem.classList.add('active');
            dockItem.setAttribute('data-label', label);
            
            Flip.from(state, {
                duration: 0.3,
                ease: 'power1.inOut'
            });
        });
    });

    dockItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            const wrapper = item.querySelector('.wrapper');
            if (wrapper) {
                const state = Flip.getState(wrapper);
                const originalParent = document.querySelectorAll('.dashboard > div')[index];
                originalParent.appendChild(wrapper);
                item.innerHTML = '';
                item.classList.remove('active');

                Flip.from(state, {
                    duration: 0.3,
                    ease: 'power1.inOut'
                });
            }
        });
    });
};

const init = () => {
    addButtons().then(() => {
        addListeners();
        Draggable.create(".dashboard > div", {
            type: "x,y",
            inertia: true
        });
    });
};

init();
