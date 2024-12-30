
# To start server

```
cd api
poetry install
poetry run python manage.py runserver 0.0.0.0:8000
```

## To share server remotely

download tailscale

```
curl -fsSL https://tailscale.com/install.sh | sh
```

and start tailscale serve

```
sudo tailscale serve 8000
```

### to schare in my subnet too

one time at least i think

```
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
sudo sysctl -p /etc/sysctl.d/99-tailscale.conf

```

```
sudo tailscale funnel 8000
```

share generated link
