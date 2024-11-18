// ======== generative visual music ========

function generativeVisualMusic(params = {}) {
    // パラメーターの構造化
    const options = {
        count: params.count ?? frameCount * 0.1,
        canvas: {
            blendMode: params.canvas?.blendMode ?? ADD,
            alpha: params.canvas?.alpha ?? 255,
            angle: params.canvas?.angle ?? 0,
            scale: params.canvas?.scale ?? 1,
            aspect: params.canvas?.aspect ?? 1,
        },
        motion: {
            speed: params.motion?.speed ?? 20,
            sinAmplitude: params.motion?.sinAmplitude ?? 0,
            noiseAmplitude: params.motion?.noiseAmplitude ?? 0,
            xArrange: params.motion?.xArrange ?? true,
            yArrange: params.motion?.yArrange ?? true,
            noiseSpeed: params.motion?.noiseSpeed ?? 0.1,
            sinSpeed: params.motion?.sinSpeed ?? 0.1,
        },
        object: {
            scale: params.object?.scale ?? 0.5,
            aspect: params.object?.aspect ?? 1,
            angle: params.object?.angle ?? 0,
            xAngleArrange: params.object?.xAngleArrange ?? 0,
            yAngleArrange: params.object?.yAngleArrange ?? 0,
            angleDivisions: params.object?.angleDivisions ?? 4,
            radius: params.object?.radius ?? 0,
        },
        color: {
            palette: params.color?.palette ?? [
                "#FF9F1C",
                "#2EC4B6",
                "#CBF3F0",
                "#FFBF69",
            ],
            count: params.color?.count ?? 3,
            xArrange: params.color?.xArrange ?? true,
            yArrange: params.color?.yArrange ?? true,
            arrange: params.color?.arrange ?? 0.1,
        },
        style: {
            mode: params.style?.mode ?? "fill",
            objectMode: params.style?.objectMode ?? "rect",
            str: params.style?.str ?? "H",
        },
    };

    // 変数
    const n = 20;
    const grid = max(width, height) / n;

    // キャンバス設定
    push();
    background(0, options.canvas.alpha);
    blendMode(options.canvas.blendMode);
    translate(width / 2, height / 2);
    rotate(options.canvas.angle);
    scale(options.canvas.scale * options.canvas.aspect, options.canvas.scale);

    // オブジェクト描画
    for (let x = -max(width, height); x <= max(width, height); x += grid) {
        for (let y = -max(width, height); y <= max(width, height); y += grid) {
            // 位置計算
            const vx = options.count * options.motion.speed;
            const vy =
                map(
                    noise(
                        x * options.motion.xArrange,
                        y * options.motion.yArrange,
                        options.count * options.motion.noiseSpeed
                    ),
                    0,
                    1,
                    -options.motion.noiseAmplitude,
                    options.motion.noiseAmplitude
                ) +
                sin(
                    options.count * options.motion.sinSpeed +
                    x * options.motion.xArrange +
                    y * options.motion.yArrange
                ) *
                options.motion.sinAmplitude;

            const nx =
                ((x + vx + max(width, height)) % (max(width, height) * 2)) -
                (max(width, height) + grid);
            const ny =
                ((y + vy + max(width, height)) % (max(width, height) * 2)) -
                (max(width, height) + grid);

            // オブジェクトのサイズと角度
            const w = grid * options.object.scale * options.object.aspect;
            const h = grid * options.object.scale;
            const radius = map(options.object.radius, 0, 1, 0, max(w, h) / 2);
            const angle = options.object.angle;

            // 色の計算
            const ci = floor(
                map(
                    newnoise(
                        x * options.color.xArrange,
                        y * options.color.yArrange,
                        options.color.arrange
                    ),
                    0,
                    1,
                    0,
                    options.color.count - 0.01
                )
            );
            const c = options.color.palette[ci];

            // オブジェクト描画
            push();
            translate(nx, ny);
            rotate(angle);

            setStyle(c, options.style.mode);

            if (options.style.objectMode === "rect") {
                rectMode(CENTER);
                rect(0, 0, w, h, radius);
            } else if (options.style.objectMode === "text") {
                push();
                scale(w, h);
                textAlign(CENTER, CENTER);
                textSize(1);
                text(options.style.str, 0, 0);
                pop();
            }

            pop();
        }
    }
    pop();
}

// ======== self-made function ========

function newnoise(x, y = 0, z = 0) {
    return max(min(map(noise(x, y, z), 0, 1, -0.2, 1.2), 1), 0);
}

function setStyle(c, mode) {
    if (mode === "fill") {
        noStroke();
        fill(c);
    } else {
        noFill();
        strokeWeight(2);
        stroke(c);
    }
}