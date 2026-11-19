export const AdminSidebar = ({
  adminName,
  members,
  searchMember,
  onSearchChange,
  selectedMember,
  onSelectMember,
  newMemberName,
  onNewMemberNameChange,
  newMemberUser,
  onNewMemberUserChange,
  newMemberPassword,
  onNewMemberPasswordChange,
  onCreateMember,
  onLogout
}) => {
  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchMember.toLowerCase())
  );

  return (
    <aside className="admin-sidebar">
      <h3>IronTrack</h3>
      <p className="trainer-greeting">
        Hola, <strong>{adminName}</strong>
      </p>

      <h4 className="sidebar-section-title">Nuevo Socio</h4>
      <form onSubmit={onCreateMember} className="add-member-form">
        <input
          type="text"
          placeholder="Nombre completo"
          value={newMemberName}
          onChange={(e) => onNewMemberNameChange(e.target.value)}
          required
          className="add-member-input"
        />
        <input
          type="text"
          placeholder="Usuario login"
          value={newMemberUser}
          onChange={(e) => onNewMemberUserChange(e.target.value)}
          required
          className="add-member-input"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={newMemberPassword}
          onChange={(e) => onNewMemberPasswordChange(e.target.value)}
          required
          className="add-member-input"
        />
        <button type="submit" className="btn-primary">
          Crear
        </button>
      </form>

      <h4 className="sidebar-section-title">Buscar Socio</h4>
      <input
        type="text"
        placeholder="Buscar..."
        value={searchMember}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />

      <ul className="member-list">
        {filteredMembers.map((member) => (
          <li
            key={member.id}
            className={`member-item ${selectedMember?.id === member.id ? 'active' : ''}`}
            onClick={() => onSelectMember(member)}
          >
            {member.name}
          </li>
        ))}
      </ul>

      <button onClick={onLogout} className="logout-btn">
        Cerrar Sesión
      </button>
    </aside>
  );
};