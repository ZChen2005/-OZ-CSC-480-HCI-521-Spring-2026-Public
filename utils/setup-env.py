

## Setting up environment variables in python

## Frontend env setup
## Backend env setup
## a) worklog folder
## b) task folder
## c) notification folder

from typing import Any

import yaml
from pathlib import Path

MICROSERVICE_PATHS = {
    "worklog":      "backend/worklog",
    "task":         "backend/task",
    "notification": "backend/notification",
}

def load_config() -> Any:
    with open("config/env.yaml") as f:
        base = yaml.safe_load(f)
    
    local_path = Path("config/env.local.yaml")
    if local_path.exists():
        with open(local_path) as f:
            local = yaml.safe_load(f)
        
        for key in local:
            if key in base and isinstance(base[key], dict):
                base[key].update(local[key])
            else:
                base[key] = local[key]

    return base

def write_backend_env(path: str, backend_vars: dict) -> None:
    Path(path).mkdir(parents=True, exist_ok=True)
    target = Path(f"{path}/src/main/liberty/config/server.env")
    with open(target, "w") as f:
        for k, v in backend_vars.items():
            f.write(f"{k}={v}\n") 

def main() -> None:
    config = load_config()
    shared = config.get("shared", {})
    
    for service, path in MICROSERVICE_PATHS.items():
        service_vars = config.get("services", {}).get(service, {})
        merged = {**shared, **service_vars}
        write_backend_env(path, merged)
        
        

if __name__ == "__main__":
    main()