import os
import math
import subprocess

VIDEO_PATH = '12.mp4'  # Altere para o caminho do seu vídeo
OUTPUT_DIR = 'fatias_video'  # Pasta de saída
MAX_SIZE_MB = 95

os.makedirs(OUTPUT_DIR, exist_ok=True)

video_size_mb = os.path.getsize(VIDEO_PATH) / (1024 * 1024)
num_parts = math.ceil(video_size_mb / MAX_SIZE_MB)

# Obtém a duração total do vídeo em segundos usando ffprobe
import json
cmd = [
    'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
    '-of', 'json', VIDEO_PATH
]
result = subprocess.run(cmd, capture_output=True, text=True)
duration = float(json.loads(result.stdout)['format']['duration'])

# Calcula a duração de cada parte
part_duration = duration / num_parts
print(f'Dividindo em {num_parts} partes de aproximadamente {part_duration:.2f} segundos cada.')

current_time = 0
part = 1
while current_time < duration:
    # Busca binária para encontrar a duração máxima que não ultrapassa MAX_SIZE_MB
    min_dur = 1  # mínimo 1 segundo
    max_dur = min(part_duration * 1.5, duration - current_time)
    best_dur = min_dur
    while min_dur <= max_dur:
        mid_dur = (min_dur + max_dur) / 2
        output_path = os.path.join(OUTPUT_DIR, f"temp_{part}.mp4")
        # 1. Tenta corte rápido (copy)
        cmd = [
            'ffmpeg', '-y', '-ss', str(int(current_time)), '-i', VIDEO_PATH, '-t', str(int(mid_dur)),
            '-c', 'copy', '-movflags', '+faststart', output_path
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        size_mb = os.path.getsize(output_path) / (1024 * 1024)
        # Se ficou grande demais, tenta diminuir a duração
        if size_mb > MAX_SIZE_MB:
            max_dur = mid_dur - 1
            os.remove(output_path)
        else:
            best_dur = mid_dur
            min_dur = mid_dur + 1
            os.remove(output_path)
    # Faz o corte final: tenta copy, se passar do limite, recodifica
    final_dur = int(best_dur)
    output_path = os.path.join(OUTPUT_DIR, f"{part}.mp4")
    # 1. Tenta corte rápido
    cmd = [
        'ffmpeg', '-y', '-ss', str(int(current_time)), '-i', VIDEO_PATH, '-t', str(final_dur),
        '-c', 'copy', '-movflags', '+faststart', output_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    # 2. Se ficou grande demais, recodifica
    if size_mb > MAX_SIZE_MB:
        print(f'Parte {part} ficou com {size_mb:.2f}MB, recodificando para garantir tamanho e compatibilidade...')
        os.remove(output_path)
        cmd = [
            'ffmpeg', '-y', '-ss', str(int(current_time)), '-i', VIDEO_PATH, '-t', str(final_dur),
            '-c:v', 'libx264', '-preset', 'fast', '-crf', '23', '-c:a', 'aac', '-movflags', '+faststart', output_path
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f'Salvando {output_path} (início: {int(current_time)}s, duração: {final_dur}s)')
    current_time += final_dur
    part += 1
print('Concluído!')
