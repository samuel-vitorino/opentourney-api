terraform {
  backend "gcs" {
    bucket = "opentourney-384222-tfstate"
    prefix = "api/env/prod"
  }
}