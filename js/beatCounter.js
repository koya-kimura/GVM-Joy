// ======== beat calculate ========

function calculateBeatInfo(bpm) {
  const beatInterval = (60 / bpm) * 1000; // 拍の間隔（ミリ秒）
  const currentTime = millis(); // 現在の時間

  // 現在の時間から直接カウントを計算
  const interpolatedCount = currentTime / beatInterval;

  // 小節カウント（4拍ごと）
  const interpolatedBarCount = interpolatedCount / 4;

  // フェーズカウント（16拍ごと）
  const interpolatedPhaseCount = interpolatedCount / 16;

  return {
    BPM: bpm,
    "Interpolated Count": interpolatedCount,
    "Interpolated Bar Count": interpolatedBarCount,
    "Interpolated Phase Count": interpolatedPhaseCount,
  };
}

// ======== UI function ========

function drawBeatUI(info) {
  // キャンバスサイズに基づいて値を計算
  const padding = min(width, height) * 0.02;
  const lineHeight = min(width, height) * 0.04;
  const boxWidth = max(width * 0.3, 250);
  const boxHeight = lineHeight * 0.8;
  const fontSize = min(width, height) * 0.025;

  push();

  // UIの背景と文字の共通スタイル設定
  textSize(fontSize);
  textAlign(LEFT, CENTER);

  // 情報を配列に変換して処理
  Object.entries(info).forEach(([key, value], index) => {
    const yPos = lineHeight * (index + 0.5);
    const textYPos = lineHeight * (index + 1);

    // 背景ボックスの描画
    noStroke();
    fill(240, 240);
    rect(padding, yPos, boxWidth, boxHeight);

    // テキストの描画
    fill(30, 240);
    text(`${key} : ${value.toFixed(2)}`, padding + fontSize / 3, textYPos);
  });

  pop();
}