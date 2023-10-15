const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Player  {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation = 0
        this.opacity = 1

        const img = new Image()
        img.src = './assets/asteroid character.png'
        img.onload = () => {
            const scale = 0.35
            this.image = img
            this.width = img.width * scale
            this.height = img.height * scale

            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 70
            }
        }
    }

    draw() {
        // c.fillStyle = 'red'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)

        c.save()
        c.globalAlpha = this.opacity
        c.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
        c.rotate(this.rotation)
        c.translate( - player.position.x - player.width / 2,  - player.position.y - player.height / 2)

        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        c.restore()
    }

    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
        }
    }
}

class Projectile {
    constructor ({position}) {
        this.position = position
        this.velocity = -2

        const img = new Image()
        img.src = './assets/laser.png'
        img.onload = () => {
            const scale = 0.15
            this.image = img
            this.width = img.width * scale
            this.height = img.height * scale
        }
    }
    
    draw() {

        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        if (this.image) {
            this.draw()
            this.position.y += this.velocity
        }
    }
}

class Enemy  {
    constructor({position}) {
        this.velocity = {
            x: 0,
            y: 0
        }

        const img = new Image()
        const srcs = ['./assets/can.png', './assets/plastic bag.png']

        const randomIndex = Math.floor(Math.random() * srcs.length)
        img.src = srcs[randomIndex]

        img.onload = () => {
            const scale = 0.15
            this.image = img
            this.width = img.width * scale
            this.height = img.height * scale

            this.position = {
                x: position.x,
                y: position.y
            }
        }
    }

    draw() {
        // c.fillStyle = 'red'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)

        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update({velocity}) {
        if (this.image) {
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }
}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 2,
            y: 0
        }
        
        this.enemies = []

        const cols = Math.floor(Math.random() * 4) + 6
        const rows = Math.floor(Math.random() * 3) + 3

        this.width = (10 * 60) - 2

        for(let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++)
            this.enemies.push(new Enemy({position: {
                                            x: x * 60,
                                            y: y * 60
                                        }}))
        }
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0

        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
        }
    }
}

const player = new Player()
const projectiles = []
const grids = []
grids.push(new Grid())


const keys = {
    a: {pressed: false},
    d: {pressed: false},
    space: {pressed: false}
}

const bg = new Image()
bg.src = './assets/asteroids bg.png'

let canFire = true

let frames = 0
let animInterval = Math.floor(Math.random() * 500 + 750)

let game = {
    over: false,
    active: true
}

// function checkEnemyCollisions(enemies, gridIndex) {
//     for (let i = 0; i < enemies.length; i++) {
//       const enemyA = enemies[i];
//       for (let j = i + 1; j < enemies.length; j++) {
//         const enemyB = enemies[j];
//         // Check for collision between enemyA and enemyB
//         if (enemyA.position.x + enemyA.width > enemyB.position.x &&
//             enemyA.position.x < enemyB.position.x + enemyB.width) {
            
//             enemies.splice(i, 1);
//             enemies.splice(j - 1, 1);
        
//             if (enemies.length > 0) {
//             const firstEnemy = enemies[0];
//             const lastEnemy = enemies[enemies.length - 1];
//             grid.width = lastEnemy.position.x + lastEnemy.width - firstEnemy.position.x;
//             grid.position.x = firstEnemy.position.x;
//             } else {
//             grids.splice(gridIndex, 1);
//             }
//             return;
//         }
//       }
//     }
// }
function checkPlayerEnemyCollision(player, enemy) {
    if (
      player.position.x + player.width > enemy.position.x &&
      player.position.x < enemy.position.x + enemy.width &&
      player.position.y + player.height > enemy.position.y &&
      player.position.y < enemy.position.y + enemy.height
    ) {
      return true; // Collision detected
    }
    return false; // No collision
}

function endGame() {
    // Display a game over message
    c.font = "48px Arial";
    c.fillStyle = "red";
    c.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
}

function handlePlayerEnemyCollision(grid, player,enemy){
    setTimeout(() => {
        const enemyFound = grid.enemies.find((enemy2) => {
            return enemy2 == enemy
        })

        if (enemyFound) {
            console.log('You lose!!')
            setTimeout(() => {
                player.opacity = 0
                game.over = true
            }, 0)

            setTimeout(() => {
                game.active = false
            }, 2000)
            
        }
    }, 0)
}

function animate () {
    if (!game.active) {
        endGame()
        return
    }
    requestAnimationFrame(animate)
    c.drawImage(bg, 0, 0)
    player.update()

    projectiles.forEach((projectile, index) => {
        if (projectile.position.y <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0)
        } else {
            projectile.update()
        }
    })

    grids.forEach((grid, gridIndex) => {
        grid.update()
        grid.enemies.forEach((enemy, i) => {
            enemy.update({velocity: grid.velocity})

        // // Check for player-enemy collision
        // if (checkPlayerEnemyCollision(player, enemy)) {
        //     // Handle the collision here
        //     handlePlayerEnemyCollision(grid, player, enemy);

        //     // Remove the enemy
        //     grid.enemies.splice(i, 1);

        //     if (grid.enemies.length === 0) {
        //     grids.splice(gridIndex, 1);
        //     }
        // }
            //Enemy-projectile collision
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y <= enemy.position.y + enemy.height && projectile.position.y >= enemy.position.y &&
                    projectile.position.x + projectile.width >= enemy.position.x && projectile.position.x <= enemy.position.x + enemy.width){
                    setTimeout(() => {
                        const enemyFound = grid.enemies.find((enemy2) => {
                            return enemy2 == enemy
                        })
                        const projectileFound = projectiles.find((projectile2) => {
                            return projectile2 == projectile
                        })
                        //remove projectiles and enemies on collision
                        if (enemyFound && projectileFound) {
                            grid.enemies.splice(i, 1)
                            projectiles.splice(j, 1)

                            if (grid.enemies.length > 0) {
                                const firstEnemy = grid.enemies[0]
                                const lastEnemy = grid.enemies[grid.enemies.length - 1]
                                grid.width = lastEnemy.position.x + lastEnemy.width - firstEnemy.position.x
                                grid.position.x = firstEnemy.position.x
                            } else {
                                grids.splice(gridIndex, 1)
                            }
                        }
                    }, 0)
                }
            })
        })
    })

    if (keys.a.pressed && player.position.x >= 0) {
        player.velocity.x = -4
        player.rotation = -0.15
    } else if (keys.d.pressed && player.position.x <= canvas.width - player.width) {
        player.velocity.x = 4
        player.rotation = 0.15
    } else {
        player.velocity.x = 0
        player.rotation = 0
    }

    if (keys.space.pressed && canFire) { // Check if you can fire
        canFire = false; // Set to false to prevent rapid firing
        projectiles.push(
          new Projectile({
            position: {
              x: player.position.x + player.width / 2,
              y: player.position.y,
            },
          })
        );

        //firing delay timeout to prevent infinite bullets
        setTimeout(() => {
        canFire = true;
        }, 300)
    }
    // if (frames % animInterval == 0) {
    //     grids.push(new Grid())
    //     animInterval = Math.floor(Math.random() * 500 + 750) //reset enemy spawn interval
    //     frames = 0
    // }

    // frames++
}

animate()

window.addEventListener('keydown', ({key}) => {
    if (game.over) return

    switch(key) {
        case ('a'):
        case ('A'):
            // console.log('left')
            keys.a.pressed = true
            break
        case 'd':
        case 'D':
            // console.log('right')
            keys.d.pressed = true
            break
        case ' ':
            //console.log(projectiles)
            keys.space.pressed = true
            break
    }
})

window.addEventListener('keyup', ({key}) => {
    switch(key) {
        case 'a':
        case 'A':
            // console.log('right')
            keys.a.pressed = false
            break
        case 'd':
        case 'D':
            // console.log('right')
            keys.d.pressed = false
            break
        case ' ':
            keys.space.pressed = false
            break
    }
})