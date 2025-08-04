output "id" {
  description = "ID of the virtual network"
  value       = azurerm_virtual_network.this.id
}

output "name" {
  description = "Name of the virtual network"
  value       = azurerm_virtual_network.this.name
}

output "address_space" {
  description = "Address space of the virtual network"
  value       = azurerm_virtual_network.this.address_space
}

output "location" {
  description = "Location of the virtual network"
  value       = azurerm_virtual_network.this.location
}
