# 保存为 fix-wsl-dns.sh
#!/bin/bash

echo "🔧 修复 WSL DNS 问题..."

# 创建 wsl.conf
sudo tee /etc/wsl.conf > /dev/null << 'EOF'
[network]
generateResolvConf = false

[boot]
systemd = true
EOF

# 删除旧的 resolv.conf
sudo rm -f /etc/resolv.conf

# 创建新的 resolv.conf
sudo tee /etc/resolv.conf > /dev/null << 'EOF'
nameserver 8.8.8.8
nameserver 1.1.1.1
nameserver 114.114.114.114
options timeout:1 attempts:1 rotate
EOF

# 锁定文件
sudo chattr +i /etc/resolv.conf

echo "✅ DNS 配置完成！"
echo "📢 请在 PowerShell 中运行: wsl --shutdown"
echo "📢 然后重新打开 WSL"
