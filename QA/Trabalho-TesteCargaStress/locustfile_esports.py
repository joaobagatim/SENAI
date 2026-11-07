"""Teste de consulta ao perfil dos jogadores, conforme o enunciado."""

from locust import HttpUser, between, task


class Jogador(HttpUser):
    host = "https://jsonplaceholder.typicode.com"
    wait_time = between(2, 4)

    @task
    def consultar_jogadores(self):
        self.client.get("/users")
